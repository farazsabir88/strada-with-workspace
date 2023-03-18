import HashedIds from 'hashids';

const Encrypter = new HashedIds(process.env.REACT_APP_SECRET_KEY);

export const encrypt = (text: number | string | undefined): string => {
  const encryptedText = Encrypter.encode(String(text));
  return encryptedText;
};
export const decrypt = (text: string | undefined): string | undefined => {
  if (text !== undefined) {
    const decryptedText = Encrypter.decode(text).toString();
    return decryptedText;
  }
  return undefined;
};
