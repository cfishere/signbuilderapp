<?php

namespace App\Policies;

use App\Models\Design;
use App\Models\User;

class DesignPolicy
{
    /**
     * Determine whether the user can view any designs.
     * - Admin: can see all
     * - Regular user: can list their own (we still scope in the controller)
     */
    public function viewAny(User $user): bool
    {
        return true; // any authenticated user
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Design $design): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $design->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // any authenticated user can create designs
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Design $design): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $design->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Design $design): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $design->user_id === $user->id;
    }

    /**
     * (Optional) Restore/forceDelete if you add soft deletes later
     */
    public function restore(User $user, Design $design): bool
    {
        return $user->isAdmin();
    }

    public function forceDelete(User $user, Design $design): bool
    {
        return $user->isAdmin();
    }
}
