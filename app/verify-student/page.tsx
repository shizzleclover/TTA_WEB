"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle, GraduationCap, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VerifyStudentPage() {
  const router = useRouter()
  const [verificationMethod, setVerificationMethod] = useState("email")
  const [studentEmail, setStudentEmail] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [studentId, setStudentId] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [country, setCountry] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleVerify = () => {
    if (verificationMethod === "email" && (!studentEmail || !schoolName)) return
    if (verificationMethod === "id" && (!studentId || !selectedFile)) return

    setIsVerifying(true)
    setVerificationStatus("pending")

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      setVerificationStatus("success")
      // In a real app, would redirect after successful verification
    }, 3000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Student Verification</h1>
                <p className="text-muted-foreground">
                  Verify your student status to access special features and pricing.
                </p>
              </div>

              <div className="mt-8">
                {verificationStatus === "success" ? (
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900 dark:text-green-100">
                          <CheckCircle className="h-8 w-8" />
                        </div>
                        <CardTitle className="mt-4">Verification Successful!</CardTitle>
                        <CardDescription>
                          Your student status has been verified. You now have access to student features.
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Your account has been upgraded to the Student plan. You can now access all student features and
                        special pricing.
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <CardTitle>Verify Your Student Status</CardTitle>
                      </div>
                      <CardDescription>Choose a verification method to confirm your student status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {verificationStatus === "pending" ? (
                        <div className="flex flex-col items-center py-8">
                          <Loader2 className="h-12 w-12 animate-spin text-primary" />
                          <h3 className="mt-4 text-lg font-medium">Verifying your student status</h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            This may take a few moments. Please don't close this page.
                          </p>
                        </div>
                      ) : (
                        <>
                          <Alert className="mb-6">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Student Benefits</AlertTitle>
                            <AlertDescription>
                              Verified students get access to premium features at a discounted rate, plus exclusive
                              educational content and student-only quizzes.
                            </AlertDescription>
                          </Alert>

                          <Tabs defaultValue="email" onValueChange={setVerificationMethod}>
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="email">School Email</TabsTrigger>
                              <TabsTrigger value="id">Student ID</TabsTrigger>
                            </TabsList>
                            <TabsContent value="email" className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Select value={country} onValueChange={setCountry}>
                                  <SelectTrigger id="country">
                                    <SelectValue placeholder="Select your country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="us">United States</SelectItem>
                                    <SelectItem value="ca">Canada</SelectItem>
                                    <SelectItem value="uk">United Kingdom</SelectItem>
                                    <SelectItem value="au">Australia</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="school">School or University</Label>
                                <Input
                                  id="school"
                                  placeholder="Enter your school name"
                                  value={schoolName}
                                  onChange={(e) => setSchoolName(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">School Email Address</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="your.name@school.edu"
                                  value={studentEmail}
                                  onChange={(e) => setStudentEmail(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Must be a valid .edu or school domain email
                                </p>
                              </div>
                              <div className="rounded-lg bg-muted p-3 text-sm">
                                <p>
                                  We'll send a verification link to your school email address. Click the link to
                                  complete verification.
                                </p>
                              </div>
                            </TabsContent>
                            <TabsContent value="id" className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <Label htmlFor="student-id">Student ID Number</Label>
                                <Input
                                  id="student-id"
                                  placeholder="Enter your student ID number"
                                  value={studentId}
                                  onChange={(e) => setStudentId(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="id-photo">Upload Student ID</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id="id-photo"
                                    type="file"
                                    accept="image/*"
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
                              <div className="rounded-lg bg-muted p-3 text-sm">
                                <p>
                                  Please upload a clear photo of your student ID. Make sure your name, school, and
                                  expiration date are visible. We'll review your submission within 24 hours.
                                </p>
                              </div>
                            </TabsContent>
                          </Tabs>

                          <Separator className="my-6" />

                          <div className="space-y-4">
                            <div>
                              <h3 className="mb-2 font-medium">Terms of Verification</h3>
                              <RadioGroup defaultValue="accept">
                                <div className="flex items-start space-x-2">
                                  <RadioGroupItem value="accept" id="accept" />
                                  <Label htmlFor="accept" className="text-sm">
                                    I confirm that I am currently enrolled as a student at an accredited educational
                                    institution and agree to the verification process.
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                    {verificationStatus !== "pending" && (
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={handleVerify}
                          disabled={
                            isVerifying ||
                            (verificationMethod === "email" && (!studentEmail || !schoolName || !country)) ||
                            (verificationMethod === "id" && (!studentId || !selectedFile))
                          }
                        >
                          {isVerifying ? "Verifying..." : "Verify Student Status"}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
