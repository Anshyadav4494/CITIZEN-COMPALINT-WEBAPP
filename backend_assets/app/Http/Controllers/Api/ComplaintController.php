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
                ->with(['category', 'images'])
                ->latest()
                ->get();
        } elseif ($user->role === 'officer') {
            // Assuming officer belongs to a department or zone, or just sees all assigned to their dept
            return Complaint::where('department_id', $user->department_id)
                ->with(['category', 'zone', 'images'])
                ->get();
        } else {
            // Admin sees all
            return Complaint::with(['category', 'department', 'zone'])
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
        ]);

        // Auto-routing logic (Simplified)
        // In real app, look up department based on category/zone
        // For now, just finding a department linked to category
        $category = Category::find($request->category_id);

        // Calculate SLA
        $deadline = Carbon::now()->addHours($category->sla_hours);

        $complaint = Complaint::create([
            'user_id' => Auth::id(),
            'category_id' => $request->category_id,
            'zone_id' => $request->zone_id,
            'department_id' => null, // Needs logic to find specific department
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'Submitted',
            'priority' => 'Medium', // Could use AI to detect priority from description
            'sla_deadline' => $deadline
        ]);

        return response()->json($complaint, 201);
    }
}
