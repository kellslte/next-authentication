import { Axios } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const { name, email, password } = await req.json();

    const { data } = await Axios.post("/auth/sign-up", {
      name,
      email,
      password,
    });

    if (data.success) return NextResponse.json({success: true, message: data.message });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
