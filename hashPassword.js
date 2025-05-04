const bcrypt = require('bcrypt');

// Replace with the password you want to hash
const password = 'adminpassword';  // The plain password you want to hash

// Generate salt and hash the password
bcrypt.genSalt(10, (err, salt) => {
  if (err) throw err;

  bcrypt.hash(password, salt, (err, hashedPassword) => {
    if (err) throw err;
    
    // This is your hashed password
    console.log('Hashed Password:', hashedPassword);
  });
});
