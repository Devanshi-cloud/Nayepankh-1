-- NayePankh Supabase Schema Migrations

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'Intern', -- 'Intern', 'Admin', 'Super Admin'
    referral_code VARCHAR(20) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    otp VARCHAR(20),
    otp_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_amount NUMERIC(12, 2) NOT NULL,
    raised_amount NUMERIC(12, 2) DEFAULT 0.00,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Fundraisers Table (For Intern Goal Tracking)
CREATE TABLE IF NOT EXISTS fundraisers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) REFERENCES users(referral_code) ON DELETE CASCADE UNIQUE,
    goal_amount NUMERIC(12, 2) DEFAULT 30000.00,
    total_raised NUMERIC(12, 2) DEFAULT 0.00,
    referrals_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Donations Table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_name VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL, -- Amount in INR
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    referral_code VARCHAR(20) REFERENCES users(referral_code) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    address TEXT,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Trigger to automatically sync raised totals on Campaign when donation is completed
CREATE OR REPLACE FUNCTION update_campaign_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.payment_status = 'completed') THEN
        UPDATE campaigns 
        SET raised_amount = raised_amount + NEW.amount 
        WHERE id = NEW.campaign_id;

        IF (NEW.referral_code IS NOT NULL) THEN
            UPDATE fundraisers 
            SET total_raised = total_raised + NEW.amount,
                referrals_count = referrals_count + 1
            WHERE referral_code = NEW.referral_code;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_completed_donation
AFTER UPDATE OF payment_status ON donations
FOR EACH ROW
WHEN (OLD.payment_status IS DISTINCT FROM 'completed' AND NEW.payment_status = 'completed')
EXECUTE FUNCTION update_campaign_totals();

-- 7. Insert default mock campaigns
INSERT INTO campaigns (title, description, goal_amount, raised_amount, start_date, end_date)
VALUES 
('Empower Girls Education', 'Provide school supplies, books, and uniforms to underprivileged girls in rural communities.', 150000.00, 45000.00, '2026-06-01', '2026-08-31'),
('Feed the Hungry Foundation', 'Distribute monthly food rations and warm meals to families facing extreme poverty.', 200000.00, 120000.00, '2026-07-01', '2026-09-30'),
('Clean Water Initiative', 'Install clean drinking water handpumps in dry districts to prevent waterborne illnesses.', 80000.00, 62000.00, '2026-05-15', '2026-08-15')
ON CONFLICT DO NOTHING;
