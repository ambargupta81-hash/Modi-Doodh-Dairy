import { Layout } from "@/components/layout";
import { PRODUCTS } from "@/lib/products";
import { motion } from "framer-motion";
import { Leaf, Heart, Shield, Truck, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const VALUES = [
  { icon: Leaf, title: "100% Natural", desc: "No preservatives, no additives. Just pure, farm-fresh dairy straight from nature.", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  { icon: Shield, title: "Quality Assured", desc: "Every product is hygienically prepared and tested to meet the highest purity standards.", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  { icon: Heart, title: "Made with Love", desc: "Crafted with traditional methods passed down through generations for authentic taste.", color: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" },
  { icon: Truck, title: "Fresh Delivery", desc: "Delivered fresh to your doorstep. We ensure freshness from farm to your family table.", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
];

const STATS = [
  { value: "500+", label: "Happy Customers" },
  { value: "10+", label: "Fresh Products" },
  { value: "3+", label: "Years of Service" },
  { value: "100%", label: "Pure & Natural" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary/5 border-b border-primary/10 py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f59e0b12_1px,transparent_1px),linear-gradient(to_bottom,#f59e0b12_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">Our Story</span>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-5 text-balance">
              About <span className="text-primary">Modi Doodh Dairy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              We are a family-owned dairy based in Madhya Pradesh, committed to bringing you the freshest, purest, and most authentic Indian dairy products — the way they were always meant to be.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Our Story */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Modi Doodh Dairy was founded with a simple but powerful vision — to make pure, traditional dairy products accessible to every family. We believe that the quality of dairy you consume directly affects your health and well-being.
              </p>
              <p>
                Starting from humble beginnings with a commitment to quality over quantity, we have grown to serve hundreds of satisfied families across Madhya Pradesh. Our products are made fresh daily using traditional methods that have been trusted for generations.
              </p>
              <p>
                From our farm to your doorstep, every product we sell — whether it's our creamy paneer, aromatic ghee, or refreshing lassi — carries the promise of purity, freshness, and authentic Indian taste.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((stat, i) => (
              <Card key={i} className="border-border/60 shadow-sm text-center overflow-hidden">
                <CardContent className="p-6">
                  <p className="text-3xl font-display font-extrabold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </section>

        {/* Our Values */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Our Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything we do is guided by these core principles.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${v.color}`}>
                      <v.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground mb-2">{v.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Products */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-foreground mb-3">Our Products</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We offer 10 fresh dairy products, all made daily with pure whole cow milk and traditional methods.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Card className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all overflow-hidden group">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={import.meta.env.BASE_URL + product.image.replace(/^\//, '')}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-3 text-center">
                    <p className="font-semibold text-sm text-foreground leading-tight">{product.name}</p>
                    <p className="text-xs text-primary font-bold mt-1">₹{product.basePrice}/{product.unitType === 'weight' ? 'kg' : 'L'}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/">
              <Button size="lg" className="shadow-md font-semibold px-8">
                Shop All Products
              </Button>
            </Link>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-primary/5 rounded-3xl border border-primary/10 p-8 md:p-12 text-center">
          <Users className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">Why Families Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
            We are not just a dairy shop — we are your family's dairy partner. Our customers trust us because we never compromise on purity, freshness, or honesty. When you order from Modi Doodh Dairy, you're choosing health for your family.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Farm Fresh Daily", "No Preservatives", "Traditional Methods", "Hygienically Packed", "Doorstep Delivery", "Honest Pricing"].map(tag => (
              <span key={tag} className="flex items-center gap-1.5 bg-card border border-border/60 text-foreground text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {tag}
              </span>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
}
