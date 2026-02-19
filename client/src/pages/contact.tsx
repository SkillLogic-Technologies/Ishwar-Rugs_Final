// pages/contact.tsx

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { api } from "@/lib/api";
// import { insertInquirySchema, type InsertInquiry } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      type: "general",
    },
  });

  const createInquiryMutation = useMutation({
    mutationFn: api.inquiries.create,
    onSuccess: () => {
      toast({
        title: "Inquiry Submitted Successfully",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    console.log("FORM DATA:", data);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#f3efe9] to-[#e7ded3] dark:from-[#2f2727] dark:to-[#1c1816] text-primary-brown dark:text-warm-gold transition-colors">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            GET IN TOUCH
          </h1>
          <p className="text-xl text-inherit opacity-80 leading-relaxed max-w-4xl mx-auto">
            Ready to transform your space with our luxury carpets? We're here to
            help you find the perfect piece or create a custom design that
            reflects your unique vision.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="bg-muted text-foreground">
              <CardHeader>
                <CardTitle className="font-serif text-3xl">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="text-warm-gold h-6 w-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-warm-gold">Address</h4>
                    <p>
                      Civil Lines, Power House Road
                      <br />
                      Bhadohi – 221401 (U.P), India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="text-warm-gold h-6 w-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-warm-gold">Phone</h4>
                    <p>05414 224518</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="text-warm-gold h-6 w-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-warm-gold">Email</h4>
                    <p>info@ishwarrugs.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">10:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Follow Us</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <a href="#" className="hover:text-warm-gold">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-warm-gold">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-warm-gold">
                  <Linkedin className="h-6 w-6" />
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-3xl">
                Send Us a Message
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                We'd love to hear from you about collections or custom designs.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+91..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inquiry Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">
                                General Inquiry
                              </SelectItem>
                              <SelectItem value="collection_inquiry">
                                Collection Inquiry
                              </SelectItem>
                              <SelectItem value="custom_design">
                                Custom Design
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Inquiry about modern rugs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={6}
                            placeholder="Tell us more..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={createInquiryMutation.isPending}
                    className="w-full btn-primary text-lg py-6"
                  >
                    {createInquiryMutation.isPending
                      ? "SENDING..."
                      : "SEND MESSAGE"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Custom Design Services */}
      <section className="py-20 bg-muted text-foreground">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Custom Design Services
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            From concept to creation — collaborate with our designers to create
            bespoke rugs that reflect your style.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {["Consultation", "Design & Approval", "Crafting & Delivery"].map(
              (step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-warm-gold text-primary-brown w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-2xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2">
                    {step}
                  </h3>
                  <p className="text-muted-foreground">
                    {step === "Consultation" &&
                      "Share your preferences, dimensions, and colors with our team."}
                    {step === "Design & Approval" &&
                      "We prepare design drafts and seek your feedback and approval."}
                    {step === "Crafting & Delivery" &&
                      "Our artisans handcraft your rug with the finest materials."}
                  </p>
                </div>
              ),
            )}
          </div>

          <Button className="btn-secondary text-lg px-8 py-4">
            START CUSTOM DESIGN
          </Button>
        </div>
      </section>

      {/* Showroom Visit */}
      <section className="py-20 bg-soft-gray dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-brown dark:text-white mb-6">
            Visit Our Showroom
          </h2>
          <p className="text-xl text-primary-brown dark:text-zinc-200 opacity-80 mb-12 max-w-3xl mx-auto">
            Explore our collections firsthand in Bhadohi. Personalized
            appointments available.
          </p>

          <div className="bg-background dark:bg-muted p-8 rounded-lg shadow-md">
            <h3 className="font-serif text-2xl font-bold text-primary-brown dark:text-white mb-4">
              Address
            </h3>
            <p className="text-primary-brown dark:text-zinc-200 mb-4">
              Civil Lines, Power House Road
              <br />
              Bhadohi – 221401 (U.P)
            </p>
            <p className="text-primary-brown dark:text-zinc-300 opacity-80 mb-6">
              Call ahead to book a personalized tour.
            </p>

            <div className="flex justify-center">
              <a href="tel:05414224518">
                <Button className="btn-primary">SCHEDULE APPOINTMENT</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Placeholder (Optional) */}
      {/* You can insert <Footer /> here */}
    </div>
  );
}
