namespace eClaims.Common
{
    public static class AppAuthorization
    {
        // ------------------------------
        // ROLE CONSTANTS
        // ------------------------------
        public static class Roles
        {
            public const string Admin = "Admin";
            public const string User = "User";
        }

        // ------------------------------
        // ROLE ID CONSTANTS
        // ------------------------------
        public static class RoleIDs
        {
            public const short Admin = 1;
            public const short User = 2;
        }

        // ------------------------------
        // POLICY CONSTANTS
        // ------------------------------
        public static class Policies
        {
            public const string RequireAdmin = "RequireAdmin";
            public const string RequireUser = "RequireUser";
        }

        public static string GetRoleNameById(short roleId)
        {
            return roleId switch
            {
                RoleIDs.Admin => Roles.Admin,
                RoleIDs.User => Roles.User,
                _ => string.Empty,
            };
        }
    }
}
