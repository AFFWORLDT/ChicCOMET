import { Shield, Award, Sparkles, Heart } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Government Certified",
    description: "Govt. test lab reports confirming quality parameters",
  },
  {
    icon: Sparkles,
    title: "100% Virgin Cotton",
    description: "Long staple yarn for extreme softness",
  },
  {
    icon: Award,
    title: "Dove Feather Standard",
    description: "Plush extreme softness & high absorbency",
  },
  {
    icon: Heart,
    title: "After Sale Support",
    description: "Customer care visits every 6 months",
  },
]

export function BrandStory() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-balance">
            Professional Hospitality Linen Excellence
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Welcome to Our World of Quality Hotel Linen. All our Bath & Bed Linen Products Are Crafted Out of 100% Virgin 
            Cotton Long Staple Yarn Producing plush Extreme softness of Dove Feather Standard & Highly Absorbent. 
            Trusted by hotels and hospitality professionals worldwide since 1984.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
