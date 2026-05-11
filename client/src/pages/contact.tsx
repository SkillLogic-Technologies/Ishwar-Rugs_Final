"use client";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import toast from "react-hot-toast";

export default function Contact() {
  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "general",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post(
        "/api/contact-us",
        data,
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success("Inquiry Sent Successfully! ✅");
        form.reset();
      } else {
        toast.error(res.data.message || "Failed to send inquiry");
      }
    } catch (error: any) {
      console.error("Contact form error:", error);
      const message = error.response?.data?.message || error.message || "Failed to send inquiry. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-20 bg-gradient-to-b from-[#f3efe9] to-[#e7ded3] dark:from-[#2f2727] dark:to-[#1c1816] text-primary-brown dark:text-warm-gold transition-colors"
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.9,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="font-serif text-5xl md:text-7xl font-bold mb-6"
          >
            GET IN TOUCH
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.6,
              duration: 0.9,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="text-xl text-inherit opacity-80 leading-relaxed max-w-4xl mx-auto"
          >
            Ready to transform your space with our luxury carpets? We're here to
            help you find the perfect piece or create a custom design that
            reflects your unique vision.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-20 bg-background text-foreground h-full"
      >
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2  gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
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
                      Civil Lines, Power House Road <br />
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
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-serif text-3xl">
                  Send Us a Message
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  We'd love to hear from you about collections or custom
                  designs.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
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
                        name="inquiryType"
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
                      className="w-full btn-primary text-lg py-6"
                    >
                      SEND MESSAGE
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
