using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using eClaims.AppSettings;

namespace eClaims.Repositories
{
    public class BaseSQL
    {
        private readonly ConnectionStrings _connectionStringsSettings;
        private readonly string? _connectionString;
        private readonly int _commandTimeout = 30;

        public BaseSQL(IOptions<ConnectionStrings> options)
        {
            _connectionStringsSettings = options.Value;
            _connectionString = _connectionStringsSettings.DefaultConnection;
        }

        private string? GetConnectionString()
        {
            return _connectionString;
        }

        public SqlConnection GetSqlConnection()
        {
            SqlConnection conn = new SqlConnection(_connectionString);
            if (conn.State != System.Data.ConnectionState.Open)
            {
                conn.Open();
            }
            return conn;
        }

        public void CloseConnection(SqlConnection connection, SqlCommand command)
        {
            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            command.Dispose();
        }

        #region Dapper Helpers
        // 1. Execute Stored Procedure and return LIST<T>
        public async Task<IEnumerable<T>> ExecuteListAsync<T>(string storedProc, DynamicParameters? parameters = null)
        {
            using var connection = GetSqlConnection();
            var result = await connection.QueryAsync<T>(
                storedProc,
                parameters,
                commandType: System.Data.CommandType.StoredProcedure,
                commandTimeout: _commandTimeout
            );

            return result ?? Enumerable.Empty<T>();
        }

        // 2. Execute Stored Procedure and return ONE ROW (or default)
        public async Task<T> ExecuteFirstorDefaultAsync<T>(string storedProc, DynamicParameters? parameters = null) where T : class, new()
        {
            using var connection = GetSqlConnection();
            var result = await connection.QueryFirstOrDefaultAsync<T>(
                storedProc,
                parameters,
                commandType: System.Data.CommandType.StoredProcedure,
                commandTimeout: _commandTimeout
            );

            return result ?? new T();
        }

        // 3. Execute Stored Procedure and return a SINGLE COLUMN (Result)
        public async Task<TResult?> ExecuteScalarAsync<TResult>(string storedProc, DynamicParameters? parameters = null)
        {
            using var connection = GetSqlConnection();
            var result = await connection.ExecuteScalarAsync<TResult>(
                storedProc,
                parameters,
                commandType: System.Data.CommandType.StoredProcedure,
                commandTimeout: _commandTimeout
            );

            return result ?? default;
        }
        #endregion

        public string GetField(SqlDataReader reader, string field)
        {
            int ordinal = reader.GetOrdinal(field);
            if (reader.IsDBNull(ordinal))
            {
                return string.Empty;
            }
            return reader.GetString(ordinal);
        }

        public bool GetFieldBool(SqlDataReader reader, string field)
        {
            int ordinal = reader.GetOrdinal(field);
            if (reader.IsDBNull(ordinal))
            {
                return false;
            }
            return reader.GetBoolean(ordinal);
        }

        public DateTime GetFieldDateTime(SqlDataReader reader, string field)
        {
            int ordinal = reader.GetOrdinal(field);
            if (reader.IsDBNull(ordinal))
            {
                return new DateTime(1753, 1, 1);
            }
            return reader.GetDateTime(ordinal);
        }

        public decimal GetFieldDecimal(SqlDataReader reader, string field)
        {
            int ordinal = reader.GetOrdinal(field);
            if (reader.IsDBNull(ordinal))
            {
                return 0;
            }
            return reader.GetDecimal(ordinal);
        }

        public int GetFieldInt(SqlDataReader reader, string field)
        {
            int ordinal = reader.GetOrdinal(field);
            if (reader.IsDBNull(ordinal))
            {
                return 0;
            }
            return reader.GetInt32(ordinal);
        }

        public byte GetFieldByte(SqlDataReader reader, string field)
        {
            int ordinal = reader.GetOrdinal(field);
            if (reader.IsDBNull(ordinal))
            {
                return 0;
            }
            return reader.GetByte(ordinal);
        }

        public long GetFieldLong(SqlDataReader reader, string field)
        {
            int ordinal = reader.GetOrdinal(field);
            if (reader.IsDBNull(ordinal))
            {
                return 0;
            }
            return reader.GetInt64(ordinal);
        }

        public Guid GetFieldGuid(SqlDataReader reader, string field)
        {
            int ordinal = reader.GetOrdinal(field);
            if (reader.IsDBNull(ordinal))
            {
                return Guid.Empty;
            }
            return reader.GetGuid(ordinal);
        }
    }
}
