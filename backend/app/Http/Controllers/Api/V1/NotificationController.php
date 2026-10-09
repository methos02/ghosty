<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Models\User;
use App\Repositories\NotificationRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

/**
 * @see memory-bank/decisions/ADR-10-notifications-in-app-agregees.md
 */
class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationRepository $notificationsR
    ) {}

    public function index(Request $request): JsonResponse
    {
        /** @var User $recipient */
        $recipient = $request->user();
        $notifications = $this->notificationsR->paginate($recipient, Config::integer('ghosty.notifications.per_page'));

        return response()->json([
            'notifications' => NotificationResource::collection($notifications->items()),
            'unread_count' => $this->notificationsR->unreadCount($recipient),
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
                'last_page' => $notifications->lastPage(),
            ],
        ]);
    }

    public function markAsRead(Request $request, string $notificationId): JsonResponse
    {
        /** @var User $recipient */
        $recipient = $request->user();
        $notification = $this->notificationsR->find($recipient, $notificationId);

        $this->notificationsR->markAsRead($notification);

        return response()->json([
            'unread_count' => $this->notificationsR->unreadCount($recipient),
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        /** @var User $recipient */
        $recipient = $request->user();

        $this->notificationsR->markAllAsRead($recipient);

        return response()->json([
            'unread_count' => 0,
        ]);
    }
}
