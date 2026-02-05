 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { useArticles } from '@/hooks/useArticles';
 import { usePages } from '@/hooks/usePages';
 import { useMedia } from '@/hooks/useMedia';
 import { Newspaper, FileText, Image, Globe } from 'lucide-react';
 import { Link } from 'react-router-dom';
 
 export default function AdminDashboard() {
   const { data: articles } = useArticles();
   const { data: pages } = usePages();
   const { data: media } = useMedia();
 
   const stats = [
     {
       title: 'Total Articles',
       value: articles?.length ?? 0,
       icon: Newspaper,
       href: '/admin/articles',
       color: 'text-blue-500',
     },
     {
       title: 'Published',
       value: articles?.filter((a) => a.status === 'published').length ?? 0,
       icon: Globe,
       href: '/admin/articles',
       color: 'text-green-500',
     },
     {
       title: 'Pages',
       value: pages?.length ?? 0,
       icon: FileText,
       href: '/admin/pages',
       color: 'text-purple-500',
     },
     {
       title: 'Media Files',
       value: media?.length ?? 0,
       icon: Image,
       href: '/admin/media',
       color: 'text-orange-500',
     },
   ];
 
   const recentArticles = articles?.slice(0, 5) ?? [];
 
   return (
     <div className="space-y-8">
       <div>
         <h1 className="text-3xl font-bold">Dashboard</h1>
         <p className="text-muted-foreground mt-1">
           Welcome to your CMS dashboard. Manage your content from here.
         </p>
       </div>
 
       {/* Stats Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {stats.map((stat) => (
           <Link key={stat.title} to={stat.href}>
             <Card className="hover:shadow-md transition-shadow cursor-pointer">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <CardTitle className="text-sm font-medium text-muted-foreground">
                   {stat.title}
                 </CardTitle>
                 <stat.icon className={`h-5 w-5 ${stat.color}`} />
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold">{stat.value}</div>
               </CardContent>
             </Card>
           </Link>
         ))}
       </div>
 
       {/* Recent Articles */}
       <Card>
         <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle>Recent Articles</CardTitle>
           <Link to="/admin/articles" className="text-sm text-primary hover:underline">
             View all
           </Link>
         </CardHeader>
         <CardContent>
           {recentArticles.length === 0 ? (
             <p className="text-muted-foreground text-center py-8">
               No articles yet. Create your first article!
             </p>
           ) : (
             <div className="space-y-4">
               {recentArticles.map((article) => (
                 <div
                   key={article.id}
                   className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                 >
                   <div className="flex-1 min-w-0">
                     <Link
                       to={`/admin/articles/${article.id}`}
                       className="font-medium hover:text-primary transition-colors truncate block"
                     >
                       {article.title}
                     </Link>
                     <p className="text-sm text-muted-foreground">{article.category}</p>
                   </div>
                   <span
                     className={`text-xs px-2 py-1 rounded-full ${
                       article.status === 'published'
                         ? 'bg-green-100 text-green-700'
                         : article.status === 'draft'
                         ? 'bg-yellow-100 text-yellow-700'
                         : 'bg-gray-100 text-gray-700'
                     }`}
                   >
                     {article.status}
                   </span>
                 </div>
               ))}
             </div>
           )}
         </CardContent>
       </Card>
     </div>
   );
 }