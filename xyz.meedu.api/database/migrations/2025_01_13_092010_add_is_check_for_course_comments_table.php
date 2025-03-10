<?php

/*
 * This file is part of the MeEdu.
 *
 * (c) 杭州白书科技有限公司
 */

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsCheckForCourseCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(\App\Constant\TableConstant::TABLE_COURSE_COMMENTS, function (Blueprint $table) {
            $table->tinyInteger('is_check')->default(0)->comment('1:审核通过,0:拒绝');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table(\App\Constant\TableConstant::TABLE_COURSE_COMMENTS, function (Blueprint $table) {
            $table->dropColumn('is_check');
        });
    }
}
