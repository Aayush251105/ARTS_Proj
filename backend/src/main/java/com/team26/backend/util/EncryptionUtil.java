package com.team26.backend.util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionUtil {
    
    private static final String ALGORITHM = "AES";
    private static final int KEY_SIZE = 256;
    
    // ⚠️ For production: load this key from environment variables or secure vault
    // This is a demo key - NEVER hardcode in production
    private static final String SECRET_KEY = "MyDemoSecurityKeyFor256BitAES12345"; // 32 characters = 256 bits
    
    /**
     * Encrypt passport data using AES
     */
    public static String encrypt(String data) {
        try {
            if (data == null || data.isEmpty()) {
                return null;
            }
            
            SecretKey key = new SecretKeySpec(SECRET_KEY.getBytes(), 0, 32, ALGORITHM);
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            
            byte[] encryptedData = cipher.doFinal(data.getBytes());
            return Base64.getEncoder().encodeToString(encryptedData);
            
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data: " + e.getMessage(), e);
        }
    }
    
    /**
     * Decrypt passport data using AES
     */
    public static String decrypt(String encryptedData) {
        try {
            if (encryptedData == null || encryptedData.isEmpty()) {
                return null;
            }
            
            SecretKey key = new SecretKeySpec(SECRET_KEY.getBytes(), 0, 32, ALGORITHM);
            
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key);
            
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);
            byte[] decryptedData = cipher.doFinal(decodedData);
            
            return new String(decryptedData);
            
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting data: " + e.getMessage(), e);
        }
    }
}
