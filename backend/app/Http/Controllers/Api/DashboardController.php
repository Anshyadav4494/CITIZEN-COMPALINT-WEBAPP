<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function citizenStats()
    {
        $user = \Auth::user();
        if (!$user)
            return response()->json(['message' => 'Unauthorized'], 401);

        $total = \App\Models\Complaint::where('user_id', $user->id)->count();
        $pending = \App\Models\Complaint::where('user_id', $user->id)->whereIn('status', ['Submitted', 'Assigned'])->count();
        $inProgress = \App\Models\Complaint::where('user_id', $user->id)->where('status', 'In Progress')->count();
        $resolved = \App\Models\Complaint::where('user_id', $user->id)->whereIn('status', ['Resolved', 'Closed'])->count();

        return response()->json([
            'total' => $total,
            'pending' => $pending,
            'in_progress' => $inProgress,
            'resolved' => $resolved
        ]);
    }

    public function officerStats()
    {
        $user = \Auth::user();
        if (!$user)
            return response()->json(['message' => 'Unauthorized'], 401);

        // If officer has no department, they see 0
        if (!$user->department_id) {
            return response()->json([
                'assigned' => 0,
                'in_progress' => 0,
                'resolved' => 0,
                'critical' => 0
            ]);
        }

        $deptId = $user->department_id;

        $assigned = \App\Models\Complaint::where('department_id', $deptId)->whereIn('status', ['Submitted', 'Assigned'])->count();
        $inProgress = \App\Models\Complaint::where('department_id', $deptId)->where('status', 'In Progress')->count();
        $resolved = \App\Models\Complaint::where('department_id', $deptId)->whereIn('status', ['Resolved', 'Closed'])->count();
        $critical = \App\Models\Complaint::where('department_id', $deptId)->where('priority', 'Critical')->whereNotIn('status', ['Resolved', 'Closed'])->count();

        return response()->json([
            'assigned' => $assigned, // or 'pending'
            'in_progress' => $inProgress,
            'resolved' => $resolved,
            'critical' => $critical
        ]);
    }

    public function adminStats()
    {
        // ... similar logic for admin if needed
        return response()->json(['message' => 'Not implemented fully'], 200);
    }
}
