
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Book as BookIcon, Library, Microscope } from "lucide-react";
import BooksTab from "@/components/catalog/BooksTab";
import ThesesTab from "@/components/catalog/ThesesTab";
import TestTab from "@/components/catalog/TestTab";

const Catalogo = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-4 sm:py-8 px-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Catálogo</h1>
          </div>
          <Tabs defaultValue="books" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="books" className="flex items-center gap-2">
                <BookIcon className="h-4 w-4" />
                Libros
              </TabsTrigger>
              <TabsTrigger value="theses" className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                Tesis
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                Prueba
              </TabsTrigger>
            </TabsList>
            <TabsContent value="books" className="mt-0">
              <BooksTab />
            </TabsContent>
            <TabsContent value="theses" className="mt-0">
              <ThesesTab />
            </TabsContent>
            <TabsContent value="test" className="mt-0">
              <TestTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalogo;
