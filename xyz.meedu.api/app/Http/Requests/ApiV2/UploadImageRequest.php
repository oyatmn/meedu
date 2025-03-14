<?php

/*
 * This file is part of the MeEdu.
 *
 * (c) 杭州白书科技有限公司
 */

namespace App\Http\Requests\ApiV2;

class UploadImageRequest extends BaseRequest
{
    public function rules()
    {
        return [
            'file' => 'required|image|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'file.required' => __('请上传文件'),
            'file.image' => __('请上传图片文件'),
            'file.max' => __('文件不能超过:size', ['size' => '2M']),
        ];
    }

    public function filldata()
    {
        return save_image($this->file('file'), 'other');
    }
}
