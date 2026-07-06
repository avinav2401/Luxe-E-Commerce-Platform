const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    console.log('🌱 Starting admin seed process...');
    
    // 1. Load env variables manually from .env.local
    const envPath = path.resolve(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('\u0000') || !envContent.includes('MONGODB_URI')) {
            const fallbackContent = fs.readFileSync(envPath, 'utf16le');
            if (fallbackContent.includes('MONGODB_URI')) {
                envContent = fallbackContent;
            }
        }
    }

    const envVars = envContent.split(/\r?\n/).reduce((acc, line) => {
        const cleanLine = line.replace(/^\uFEFF/, '').trim();
        const match = cleanLine.match(/^([^=]+)=(.*)$/);
        if (match) acc[match[1].trim()] = match[2].trim().replace(/['"]/g, '');
        return acc;
    }, {});

    const uri = process.env.MONGODB_URI || envVars['MONGODB_URI'];
    if (!uri) {
        console.error('❌ MONGODB_URI not found!');
        console.error('Please add MONGODB_URI=your_mongodb_connection_string to .env.local');
        console.error('Or run it like this: MONGODB_URI="..." npm run seed-admin');
        process.exit(1);
    }

    // 2. Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to database.');

    // 3. Define minimal User schema to avoid TS compilation issues
    const UserSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        role: String
    });
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const adminEmail = 'admin@luxe.com';

    // 4. Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Existing user updated to admin.');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: <Your existing password>`);
    } else {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        console.log('✅ Admin user created successfully.');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: admin123`);
        console.log('⚠️ Please change this password after your first login!');
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from database.');
    process.exit(0);
}

seedAdmin().catch(err => {
    console.error('❌ Error seeding admin:', err);
    process.exit(1);
});
