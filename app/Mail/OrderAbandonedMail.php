<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderAbandonedMail extends Mailable
{
    use Queueable, SerializesModels;

    public array $payload;

    public function __construct(array $payload)
    {
        $this->payload = $payload;
    }

    public function build(): self
    {
        return $this->subject('Payment Not Completed')
            ->view('emails.order_abandoned')
            ->with($this->payload);
    }
}
