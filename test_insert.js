const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(envFile.split('\n').filter(Boolean).map(line => line.split('=')));

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  // 1. Sign up admin user (this will trigger handle_new_user)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'testadmin2@example.com',
    password: 'password123',
    options: {
      data: {
        role: 'admin',
        full_name: 'Test Admin'
      }
    }
  });
  
  if (authError) {
    console.log("Auth Error:", authError);
  } else {
    console.log("Signed up user:", authData.user.id);
  }

  // 2. Try to insert a puppy (this will test the RLS policy)
  const { data: insertData, error: insertError } = await supabase
    .from('puppies')
    .insert([{
      name: 'Test Puppy',
      breed: 'Cocker',
      age: '8 weeks',
      gender: 'Male',
      adoption_fee: 1000,
      status: 'available'
    }]);

  if (insertError) {
    console.log("Insert Error:", insertError);
  } else {
    console.log("Inserted puppy:", insertData);
  }
}
test();
