<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Zone;
use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Zones
        $zones = [
            ['name' => 'North Zone', 'city' => 'Smart City'],
            ['name' => 'South Zone', 'city' => 'Smart City'],
            ['name' => 'East Zone', 'city' => 'Smart City'],
            ['name' => 'West Zone', 'city' => 'Smart City'],
        ];

        foreach ($zones as $z) {
            Zone::firstOrCreate(['name' => $z['name']], $z);
        }

        // 2. Create Categories & Departments
        // For simplicity, 1-to-1 mapping for now
        $data = [
            ['cat' => 'Garbage Collection', 'dept' => 'Sanitation Dept', 'sla' => 24],
            ['cat' => 'Street Light', 'dept' => 'Electricity Dept', 'sla' => 48],
            ['cat' => 'Potholes', 'dept' => 'Roads & Transport', 'sla' => 72],
            ['cat' => 'Water Supply', 'dept' => 'Water Board', 'sla' => 24],
            ['cat' => 'Noise Pollution', 'dept' => 'Environment Control', 'sla' => 12],
        ];

        foreach ($data as $item) {
            $category = Category::firstOrCreate(
                ['name' => $item['cat']],
                ['sla_hours' => $item['sla']]
            );

            Department::firstOrCreate(
                ['name' => $item['dept']],
                ['category_id' => $category->id]
            );
        }

        // 3. Create Users

        // Citizen
        User::firstOrCreate(
            ['email' => 'citizen@example.com'],
            [
                'name' => 'Citizen',
                'password' => Hash::make('password'), // Simple password for demo
                'role' => 'citizen'
            ]
        );

        // Officer (assigned to Sanitation Dept)
        $sanitationDept = Department::where('name', 'Sanitation Dept')->first();
        User::firstOrCreate(
            ['email' => 'officer@example.com'],
            [
                'name' => 'Officer',
                'password' => Hash::make('password'),
                'role' => 'officer',
                'department_id' => $sanitationDept->id
            ]
        );

        // Admin
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin'
            ]
        );
    }
}
