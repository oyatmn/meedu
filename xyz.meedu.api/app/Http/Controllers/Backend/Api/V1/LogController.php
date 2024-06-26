<?php

/*
 * This file is part of the MeEdu.
 *
 * (c) 杭州白书科技有限公司
 */

namespace App\Http\Controllers\Backend\Api\V1;

use Illuminate\Http\Request;
use App\Models\AdministratorLog;
use App\Meedu\ServiceV2\Models\UserLoginRecord;
use App\Meedu\ServiceV2\Models\UserUploadImage;

class LogController extends BaseController
{
    public function admin(Request $request)
    {
        $adminId = (int)$request->input('admin_id');
        $module = $request->input('module');
        $opt = $request->input('opt');

        $logs = AdministratorLog::query()
            ->when($adminId, function ($query) use ($adminId) {
                $query->where('admin_id', $adminId);
            })
            ->when($module, function ($query) use ($module) {
                $query->where('module', $module);
            })
            ->when($opt, function ($query) use ($opt) {
                $query->where('opt', $opt);
            })
            ->orderByDesc('id')
            ->paginate($request->input('size', 10));

        return $this->successData([
            'total' => $logs->total(),
            'data' => $logs->items(),
        ]);
    }

    public function userLogin(Request $request)
    {
        $userId = (int)$request->input('user_id');

        $list = UserLoginRecord::query()
            ->select(['id', 'user_id', 'ip', 'platform', 'ua', 'iss', 'jti', 'exp', 'is_logout', 'created_at'])
            ->with(['user:id,nick_name,avatar'])
            ->when($userId, function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->orderByDesc('id')
            ->paginate($request->input('size', 10));

        return $this->successData([
            'data' => $list->items(),
            'total' => $list->total(),
        ]);
    }

    public function uploadImages(Request $request)
    {
        $userId = (int)$request->input('user_id');

        $list = UserUploadImage::query()
            ->when($userId, function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->orderByDesc('id')
            ->paginate($request->input('size', 10));

        return $this->successData([
            'data' => $list->items(),
            'total' => $list->total(),
        ]);
    }

    public function runtime()
    {
        $logPath = storage_path('logs/laravel.log');

        $data = [];

        if (file_exists($logPath)) {
            $handle = fopen($logPath, 'r');
            if (!$handle) {
                return $this->error(__('无法读取日志文件'));
            }


            $lineCounter = 0;
            $pos = -1;
            $buffer = '';

            fseek($handle, -1, SEEK_END);

            while (-1 !== fseek($handle, $pos, SEEK_END)) {
                $char = fgetc($handle);
                $buffer .= $char;

                if ($char === "\n") {
                    $lineCounter++;
                    if ($lineCounter >= 1000) {
                        break;
                    }
                }

                $pos--;
            }

            fclose($handle);

            if ($buffer) {
                $buffer = strrev($buffer);
                $data = array_reverse(explode("\n", $buffer));
            }
        }

        return $this->successData([
            'latest_content' => $data,
        ]);
    }
}
