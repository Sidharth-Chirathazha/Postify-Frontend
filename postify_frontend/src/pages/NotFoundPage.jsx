export default function NotFoundPage() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="mt-4">The page you're looking for doesn't exist.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 text-primary underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }