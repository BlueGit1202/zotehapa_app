export const permissionChecker = (permissionName, permissions) => {
  for (let i = 0; i < permissions.length; i++) {
    if (typeof permissions[i].name !== "undefined" && permissions[i].name) {
      if (permissions[i].name === permissionName) {
        return permissions[i].access;
      }
    }
  }
  return false;
};
