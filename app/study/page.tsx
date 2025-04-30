"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Download, FileText, Plus, Trash, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StudyMaterialsPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [generatingQuestions, setGeneratingQuestions] = useState(false)
  const [materialTitle, setMaterialTitle] = useState("")
  const [materialSubject, setMaterialSubject] = useState("")

  // Sample study materials
  const studyMaterials = [
    {
      id: 1,
      title: "World History Notes",
      subject: "History",
      pages: 12,
      questions: 45,
      date: "April 15, 2023",
      type: "PDF",
    },
    {
      id: 2,
      title: "Biology Fundamentals",
      subject: "Science",
      pages: 24,
      questions: 78,
      date: "March 28, 2023",
      type: "DOCX",
    },
    {
      id: 3,
      title: "Calculus Formulas",
      subject: "Mathematics",
      pages: 8,
      questions: 32,
      date: "April 2, 2023",
      type: "PDF",
    },
    {
      id: 4,
      title: "Literary Analysis",
      subject: "Literature",
      pages: 18,
      questions: 54,
      date: "April 10, 2023",
      type: "PDF",
    },
  ]

  // Sample generated questions
  const generatedQuestions = [
    {
      id: 1,
      question: "What was the primary cause of World War I?",
      answer: "Assassination of Archduke Franz Ferdinand",
      difficulty: "Medium",
    },
    {
      id: 2,
      question: "Who was the first president of the United States?",
      answer: "George Washington",
      difficulty: "Easy",
    },
    {
      id: 3,
      question: "What is the chemical symbol for gold?",
      answer: "Au",
      difficulty: "Easy",
    },
    {
      id: 4,
      question: "What is the Pythagorean theorem?",
      answer: "a² + b² = c²",
      difficulty: "Medium",
    },
    {
      id: 5,
      question: "Who wrote 'Pride and Prejudice'?",
      answer: "Jane Austen",
      difficulty: "Medium",
    },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile || !materialTitle || !materialSubject) return

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      setSelectedFile(null)
      setMaterialTitle("")
      setMaterialSubject("")
      // Would add the new material to the list here
    }, 2000)
  }

  const handleGenerateQuestions = (materialId: number) => {
    setGeneratingQuestions(true)

    // Simulate question generation
    setTimeout(() => {
      setGeneratingQuestions(false)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
                <p className="text-muted-foreground">
                  Upload study materials and generate questions to test your knowledge.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="flex h-[220px] cursor-pointer flex-col items-center justify-center border-dashed">
                      <CardContent className="flex flex-col items-center justify-center pt-6">
                        <div className="rounded-full bg-primary/10 p-4">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="mt-4 font-medium">Upload New Material</h3>
                        <p className="text-sm text-muted-foreground">PDF, DOCX, or TXT files</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Study Material</DialogTitle>
                      <DialogDescription>
                        Upload your study material to generate questions and test your knowledge.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter a title for your material"
                          value={materialTitle}
                          onChange={(e) => setMaterialTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select value={materialSubject} onValueChange={setMaterialSubject}>
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                            <SelectItem value="literature">Literature</SelectItem>
                            <SelectItem value="geography">Geography</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="file"
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileChange}
                            className="flex-1"
                          />
                        </div>
                        {selectedFile && (
                          <p className="text-xs text-muted-foreground">
                            Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                          </p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleUpload}
                        disabled={isUploading || !selectedFile || !materialTitle || !materialSubject}
                      >
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {studyMaterials.map((material) => (
                  <Card key={material.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="line-clamp-1">{material.title}</CardTitle>
                          <CardDescription>{material.subject}</CardDescription>
                        </div>
                        <Badge variant="outline">{material.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Pages</p>
                          <p className="font-medium">{material.pages}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Questions</p>
                          <p className="font-medium">{material.questions}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Uploaded</p>
                          <p className="font-medium">{material.date}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 border-t bg-muted/20 p-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm" className="flex-1">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Quiz
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Generated Questions</CardTitle>
                  <CardDescription>Questions generated from your study materials</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="easy">Easy</TabsTrigger>
                      <TabsTrigger value="medium">Medium</TabsTrigger>
                      <TabsTrigger value="hard">Hard</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="space-y-4 pt-4">
                      {generatedQuestions.map((q) => (
                        <div key={q.id} className="rounded-lg border p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <Badge variant="outline">{q.difficulty}</Badge>
                            <Button variant="ghost" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="font-medium">{q.question}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Answer: <span className="font-medium">{q.answer}</span>
                          </p>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="easy" className="pt-4">
                      {generatedQuestions
                        .filter((q) => q.difficulty === "Easy")
                        .map((q) => (
                          <div key={q.id} className="rounded-lg border p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <Badge variant="outline">{q.difficulty}</Badge>
                              <Button variant="ghost" size="sm">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="font-medium">{q.question}</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Answer: <span className="font-medium">{q.answer}</span>
                            </p>
                          </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="medium" className="pt-4">
                      {generatedQuestions
                        .filter((q) => q.difficulty === "Medium")
                        .map((q) => (
                          <div key={q.id} className="rounded-lg border p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <Badge variant="outline">{q.difficulty}</Badge>
                              <Button variant="ghost" size="sm">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="font-medium">{q.question}</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Answer: <span className="font-medium">{q.answer}</span>
                            </p>
                          </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="hard" className="pt-4">
                      {generatedQuestions
                        .filter((q) => q.difficulty === "Hard")
                        .map((q) => (
                          <div key={q.id} className="rounded-lg border p-4">
                            <div className="mb-2 flex items-center justify-between">
                              <Badge variant="outline">{q.difficulty}</Badge>
                              <Button variant="ghost" size="sm">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="font-medium">{q.question}</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Answer: <span className="font-medium">{q.answer}</span>
                            </p>
                          </div>
                        ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Questions
                  </Button>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Custom Question
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
