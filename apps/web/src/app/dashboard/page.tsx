'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@monorepo/ui';
import { useAuthStore } from '@/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                欢迎回来，{user.profile?.firstName || user.username}！
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>👤 用户信息</CardTitle>
                <CardDescription>
                  您的基本账户信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">用户名:</span> {user.username}
                  </div>
                  <div>
                    <span className="font-medium">邮箱:</span> {user.email}
                  </div>
                  {user.profile && (
                    <>
                      <div>
                        <span className="font-medium">姓名:</span> {user.profile.firstName} {user.profile.lastName}
                      </div>
                      {user.profile.bio && (
                        <div>
                          <span className="font-medium">简介:</span> {user.profile.bio}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔐 账户安全</CardTitle>
                <CardDescription>
                  管理您的账户安全设置
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    修改密码
                  </button>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-medium">
                    查看登录历史
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 使用统计</CardTitle>
                <CardDescription>
                  您的使用情况统计
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">注册时间:</span>{' '}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">最后更新:</span>{' '}
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">账户状态:</span>{' '}
                    <span className="text-green-600">正常</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>🚀 快速开始</CardTitle>
                <CardDescription>
                  探索更多功能
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">📝</div>
                    <h3 className="font-medium">完善资料</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      添加更多个人信息
                    </p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🔧</div>
                    <h3 className="font-medium">系统设置</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      自定义您的体验
                    </p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">📚</div>
                    <h3 className="font-medium">帮助中心</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      获取使用帮助
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}