import {NativeModules} from 'react-native';

var nextId = 0;

function SQLite3Error(message: any) {
 this.message = message;
}

SQLite3Error.prototype = new Error();

function Database(databaseName, openCallback) {
  this._databaseId = null;
  this._databaseName = databaseName;
  // List of actions pending database connection
  this._pendingActions = [];

  NativeModules.RNSpatialite.openFromFilename(databaseName, (error, databaseId) => {
    if (error) {
      error = new SQLite3Error(error);
      this._failPendingActions(error);
      return openCallback(error, null);
    }
    this._databaseId = databaseId;
    this._runPendingActions();
    openCallback(null, this);
  });
}

Database.prototype = {

  getName(): string {
    return this._databaseName;
  },

  executeSQL (
    sql: string,
    params: Array<?(number|string)>,
    rowCallback: ((row: Object) => void),
    completeCallback: ((error: ?SQLite3Error) => void)
  ) : void {
    this._addAction(completeCallback, (callback) => {
      NativeModules.RNSpatialite.prepareStatement(this._databaseId, sql, params, (error, statementId) => {
        if (error) {
          completeCallback(new SQLite3Error(error));
          return;
        }
        var next = () => {
          NativeModules.RNSpatialite.stepStatement(this._databaseId, statementId, (error, row) => {
            if (error) {
              completeCallback(new SQLite3Error(error));
              return;
            }
            if (row === null) {
              completeCallback(null);
            } else {
              try {
                rowCallback(row);
              } finally {
                next();
              }
            }
          });
        };
        next();
      });
    });
  },

  close(callback: ?(error: ?SQLite3Error) => void) {
    NativeModules.RNSpatialite.closeDatabase(this._databaseId, (error) => {
      if (!callback) return;
      if (error) {
        callback(new SQLite3Error(error));
      } else {
        callback(null);
      }
    });
  },

  _addAction(callback, action) {
    if (this._databaseId) {
      action(callback);
    } else {
      this._pendingActions.push({action, callback});
    }
  },

  _runPendingActions () {
    this._pendingActions.forEach(
       ({action, callback}) => {
        action(callback);
      });
  },

  _failPendingActions (error) {
    this._pendingActions.forEach(
      ({action, callback}) => {
        callback(error);
      });
  }
};

export const RNSpatialite = {
  SQLite3Error: SQLite3Error,
  open (databaseName: string, callback: ?((error: ?SQLite3Error, database: ?Database) => void) ) : Database {
    return new Database(databaseName, callback || ((e) => null));
  }
};
