const CryptoJS = require("crypto-js");

module.exports.handler = async (event, context, callback) => {
  const key = "123";
  const message = "test";
  const encrypted = CryptoJS.AES.encrypt(message, key).toString();
  const decrypted = CryptoJS.AES.decrypt(encrypted, key).toString(
    CryptoJS.enc.Utf8
  );

  console.log({ message, encrypted, decrypted });
};
