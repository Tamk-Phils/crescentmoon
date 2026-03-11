const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(Boolean).map(line => line.split('=')));

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
    // First, check what users exist
    const { data: users, error: userErr } = await supabase.from('users').select('*');
    console.log("Users in DB:", users);

    // Or check auth.users? We can't query auth.users with anon key.

    // Let's create an admin account or login if exists
    const email = 'admin_test100@example.com';
    const password = 'Password123!';

    let result = await supabase.auth.signInWithPassword({ email, password });

    if (result.error && result.error.message.includes("Invalid login credentials")) {
        console.log("Signing up...");
        result = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: 'admin',
                    full_name: 'Super Admin'
                }
            }
        });
    }

    if (result.error) {
        console.log("Auth error:", result.error);
        return;
    }

    console.log("Logged in as:", result.data.user.id);

    // Wait a sec for the trigger to insert into public.users
    await new Promise(r => setTimeout(r, 1000));

    // Check the public.users record
    const { data: myUser } = await supabase.from('users').select('*').eq('id', result.data.user.id).single();
    console.log("My user record:", myUser);

    // Try to insert a puppy
    const { error: insertErr } = await supabase.from('puppies').insert([{
        name: 'Test RLS Puppy',
        breed: 'Cocker Spaniel',
        age: '12 weeks',
        gender: 'Female',
        adoption_fee: 1000,
        status: 'available',
        description: 'Test'
    }]);

    console.log("Insert result error:", insertErr ? insertErr.message : "SUCCESS!");
}

test();
