<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        // Citizen
        DB::table('users')->insertOrIgnore([
            'id' => 1,
            'name' => 'Demo Citizen',
            'email' => 'citizen@test.com',
            'password' => Hash::make('password'),
            'role' => 'citizen',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Officer
        DB::table('users')->insertOrIgnore([
            'id' => 2,
            'name' => 'Demo Officer',
            'email' => 'officer@test.com',
            'password' => Hash::make('password'),
            'role' => 'officer',
            'department_id' => 1, // Assumes dept 1 exists, otherwise null
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Admin
        DB::table('users')->insertOrIgnore([
            'id' => 3,
            'name' => 'City Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Also seed some categories so the app isn't empty
        DB::table('categories')->insertOrIgnore([
            ['id' => 1, 'name' => 'Roads & Potholes', 'sla_hours' => 48],
            ['id' => 2, 'name' => 'Garbage Collection', 'sla_hours' => 24],
            ['id' => 3, 'name' => 'Street Lights', 'sla_hours' => 72],
        ]);

        // Seed Zones
        DB::table('zones')->insertOrIgnore([
            ['id' => 1, 'name' => 'North Zone', 'city' => 'Smart City'],
            ['id' => 2, 'name' => 'South Zone', 'city' => 'Smart City'],
        ]);
    }
}
