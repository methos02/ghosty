<?php

namespace App\Http\Controllers\Api\V1;

use App\DTO\NotificationPreferencesDTO;
use App\DTO\UserProfileDTO;
use App\Helpers\TokenCookieSettingsHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteAccountRequest;
use App\Http\Requests\UpdateEmailRequest;
use App\Http\Requests\UpdateNotificationPreferencesRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UsernameAvailabilityRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * @see memory-bank/decisions/ADR-20-identite-et-gestion-du-compte.md
 */
class AccountController extends Controller
{
    public function __construct(
        private readonly UserRepository $usersR,
        private readonly AccountService $accountService
    ) {}

    public function usernameAvailability(UsernameAvailabilityRequest $request): JsonResponse
    {
        $isTaken = $this->usersR->isUsernameTaken($request->string('username')->toString(), $this->user($request)->id);

        return response()->json([
            'available' => ! $isTaken,
        ]);
    }

    public function updateProfile(UpdateProfileRequest $request): UserResource
    {
        $user = $this->accountService->updateProfile($this->user($request), UserProfileDTO::fromRequest($request));

        return new UserResource($user);
    }

    public function updateNotifications(UpdateNotificationPreferencesRequest $request): UserResource
    {
        $user = $this->accountService->updateNotificationPreferences($this->user($request), NotificationPreferencesDTO::fromRequest($request));

        return new UserResource($user);
    }

    public function updateEmail(UpdateEmailRequest $request): UserResource
    {
        $user = $this->accountService->updateEmail($this->user($request), $request->string('email')->toString());

        return new UserResource($user);
    }

    public function updatePassword(UpdatePasswordRequest $request): Response
    {
        $user = $this->user($request);

        $this->accountService->updatePassword($user, $request->string('password')->toString(), $user->currentAccessToken()->id);

        return response()->noContent();
    }

    public function destroyAvatar(Request $request): UserResource
    {
        $user = $this->accountService->deleteAvatar($this->user($request));

        return new UserResource($user);
    }

    public function destroy(DeleteAccountRequest $request): Response
    {
        $this->accountService->delete($this->user($request));

        $settings = TokenCookieSettingsHelper::fromConfig();

        return response()->noContent()
            ->withCookie($settings->forget($settings->name))
            ->withCookie($settings->forget($settings->sessionName));
    }

    private function user(Request $request): User
    {
        /** @var User $user */
        $user = $request->user();

        return $user;
    }
}
