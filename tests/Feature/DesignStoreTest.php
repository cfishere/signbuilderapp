<?php

namespace Tests\Feature;

use App\Models\Design;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
/*use Laravel\Sanctum\Sanctum;*/ // remove if you're not using Sanctum

class DesignStoreTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function authenticated_user_can_store_design()
    {
        // 1. Arrange: create a user & authenticate
        $user = User::factory()->create();

        // If you're using Sanctum for /api routes:
        /*Sanctum::actingAs($user);*/
        $this->actingAs($user); // uses 'web' guard by default
        // If you're NOT using Sanctum, comment the line above and use:
        // $this->actingAs($user);

        // 2. Arrange: build a payload like the frontend will send
        $payload = [
            'name'          => 'Main Street Wall Sign',
            'slug'          => 'main-street-wall-sign',

            'sign_type'     => 'wall_sign_cabinet',
            'sign_category' => 'Wall Sign',

            'sign_width'    => 144,  // inches
            'sign_height'   => 36,   // inches
            'sign_depth'    => 8,    // inches

            'canvas_width'  => 1400,
            'canvas_height' => 600,
            'grid_size'     => 24,
            'grid_enabled'  => true,
            'snap_to_grid'  => true,
            'background_color' => '#ffffff',

            'canvas_state'  => [
                'version' => '5.3.0',
                'objects' => [
                    [
                        'type' => 'rect',
                        'left' => 100,
                        'top'  => 100,
                        'width' => 300,
                        'height' => 100,
                        'fill' => '#000000',
                    ],
                ],
            ],

            'settings'      => [
                'template_key' => 'wall_sign_cabinet_basic',
            ],

            'order_id'      => null,
            'status'        => 'draft',
        ];

        // 3. Act: call the API endpoint
        /*$response = $this->postJson('/api/designs', $payload);*/
        $response = $this->postJson(route('designs.store'), $payload);

        // 4. Assert: HTTP status & JSON shape
        $response
            ->assertStatus(201)
            ->assertJsonFragment([
                'name'      => 'Main Street Wall Sign',
                'sign_type' => 'wall_sign_cabinet',
                'status'    => 'draft',
            ])
            ->assertJsonPath('user_id', $user->id);

        // 5. Assert: database actually has it
        $this->assertDatabaseHas('designs', [
            'user_id'   => $user->id,
            'name'      => 'Main Street Wall Sign',
            'sign_type' => 'wall_sign_cabinet',
        ]);

        // Optional: assert canvas_state stored as JSON
        $design = Design::first();
        $this->assertIsArray($design->canvas_state);
        $this->assertEquals('wall_sign_cabinet_basic', $design->settings['template_key'] ?? null);
    }
}
