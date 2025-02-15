import {
  LinkedInLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
} from "@radix-ui/react-icons";

export default function Footer() {
  return (
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-700">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-2 px-8 md:flex-row md:gap-4">
            <p className="text-center text-sm md:text-left">
              © 2025 Vault Technologies LLC. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {([
              { icon: TwitterLogoIcon },
              { icon: LinkedInLogoIcon },
              { icon: InstagramLogoIcon },
            ] as const).map((link, index) => (
                <div
                    key={index}
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <link.icon className="h-6 w-6" />
                </div>
            ))}
          </div>
        </div>
      </footer>
  );
}
