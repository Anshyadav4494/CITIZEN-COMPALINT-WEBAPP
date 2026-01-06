<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'zone_id',
        'department_id',
        'title',
        'description',
        'location_lat',
        'location_lng',
        'address',
        'status',
        'priority',
        'sla_deadline',
        'resolved_at'
    ];

    protected $casts = [
        'sla_deadline' => 'datetime',
        'resolved_at' => 'datetime',
        'location_lat' => 'float',
        'location_lng' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function zone()
    {
        return $this->belongsTo(Zone::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function images()
    {
        return $this->hasMany(ComplaintImage::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(StatusLog::class);
    }
}
