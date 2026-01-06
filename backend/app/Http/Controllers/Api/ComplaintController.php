<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->role === 'citizen') {
            return Complaint::where('user_id', $user->id)
                ->with(['category', 'images', 'zone', 'department'])
                ->latest()
                ->get();
        } elseif ($user->role === 'officer') {
            // Officer sees complaints assigned to their department
            // If officer has a zone, filter by zone too? For now, just department.
            // If department_id is null/0, they might not see anything.
            if (!$user->department_id) {
                return [];
            }

            return Complaint::where('department_id', $user->department_id)
                ->with(['category', 'zone', 'images', 'user'])
                ->latest()
                ->get();
        } else {
            // Admin sees all
            return Complaint::with(['category', 'department', 'zone', 'user'])
                ->latest()
                ->limit(100)
                ->get();
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'zone_id' => 'required|exists:zones,id',
            // address is optional now
        ]);

        // Auto-assign Department based on Category
        // In our seeder/schema, Department links to Category.
        // So we find the department that handles this category.
        $department = \App\Models\Department::where('category_id', $request->category_id)->first();

        $category = Category::find($request->category_id);
        $zone = \App\Models\Zone::find($request->zone_id);

        // Calculate SLA
        $deadline = Carbon::now()->addHours($category->sla_hours ?? 48);

        $complaint = Complaint::create([
            'user_id' => Auth::id(),
            'category_id' => $request->category_id,
            'zone_id' => $request->zone_id,
            'department_id' => $department ? $department->id : null,
            'title' => $request->title,
            'description' => $request->description,
            'address' => $request->address ?? $zone->name . ', ' . $zone->city, // Fallback address
            'status' => 'Submitted',
            'priority' => 'Medium', // Could use AI to detect priority from description
            'sla_deadline' => $deadline
        ]);

        return response()->json($complaint, 201);
    }
}
