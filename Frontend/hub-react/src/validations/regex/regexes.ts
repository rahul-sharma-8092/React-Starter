export const NAME_REGEX = /^[A-Za-z\s'.-_]+$/;
export const EMAIL_REGEX =
    /^(?!.*\.\.)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,63}[A-Za-z0-9])?@([A-Za-z0-9-]+\.)+[A-Za-z]{2,63}$/i;
export const MOBILE_REGEX = /^[6-9]\d{9}$/;
export const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
export const ADDRESS_REGEX = /^[A-Za-z0-9\s,.'-_/#@&]+$/;
