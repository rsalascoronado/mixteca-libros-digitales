
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import BooksTab from "@/components/catalog/BooksTab";

const Catalogo = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-4 sm:py-8 px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Catálogo</h1>
          </div>
          <Tabs defaultValue="libros" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="libros" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Libros
              </TabsTrigger>
            </TabsList>
            <TabsContent value="libros" className="mt-0">
              <BooksTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalogo;

