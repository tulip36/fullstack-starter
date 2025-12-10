import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@monorepo/ui';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              欢迎使用 Monorepo Bootstrap
            </h1>
            <p className="text-xl text-gray-600">
              通用前后端分离Monorepo系统 - 快速启动您的全栈应用
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>🚀 快速开始</CardTitle>
                <CardDescription>
                  使用我们预配置的模板，几分钟内启动您的项目
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Next.js 14 + App Router</li>
                  <li>• Fastify + TypeScript</li>
                  <li>• Prisma ORM</li>
                  <li>• Tailwind CSS</li>
                  <li>• 类型安全的API</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🛠️ 开发工具</CardTitle>
                <CardDescription>
                  完整的开发工具链，提升开发效率
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• ESLint + Prettier</li>
                  <li>• Husky Git Hooks</li>
                  <li>• Jest 测试框架</li>
                  <li>• Turborepo 构建</li>
                  <li>• 热重载开发</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="space-x-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                登录
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                注册
              </Link>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              技术栈
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-sm font-medium">React</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <div className="text-sm font-medium">Next.js</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔧</div>
                <div className="text-sm font-medium">TypeScript</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-sm font-medium">Tailwind</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm font-medium">Fastify</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🗄️</div>
                <div className="text-sm font-medium">Prisma</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📦</div>
                <div className="text-sm font-medium">pnpm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏗️</div>
                <div className="text-sm font-medium">Turborepo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}