export default function Login() {
  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-xl font-semibold mb-3">Login</h1>
      <form action="/api/login" method="post" className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input name="email" type="email" required className="w-full rounded-xl border p-2" defaultValue="guest1@demo.local"/>
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input name="password" type="password" required className="w-full rounded-xl border p-2" defaultValue="guest123"/>
        </div>
        <button className="btn w-full" type="submit">Login</button>
      </form>
      <p className="text-xs text-gray-500 mt-3">Demo users are pre-seeded.</p>
    </div>
  )
}
