import Link from "next/link";
import { GetServerSideProps } from "next";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { PrismaClient } from "@prisma/client";
import { FaMoneyBillWave, FaPiggyBank, FaHandHoldingUsd, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "myearnifysecretkey";

type Props = {
  coins: number;
};

export default function FinancePage({ coins }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 py-4 shadow-md flex items-center justify-between px-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 hover:text-blue-300 transition"
        >
          <FaArrowLeft size={18} /> Back
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FaMoneyBillWave /> Finance
        </h1>
        <div className="w-6" /> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-10 gap-10">
        {/* Account Balance Card */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col items-center w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">Account Balance</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-bold text-yellow-400">{coins ?? 0}</span>
            <FaMoneyBillWave className="text-yellow-400" size={28} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-6 w-full max-w-md">
          <Link
            href="/finance/loan"
            className="bg-green-700 hover:bg-green-600 px-8 py-4 rounded-xl font-semibold shadow-lg text-center transition flex items-center justify-center gap-3"
          >
            <FaHandHoldingUsd size={20} /> Apply for Loan
          </Link>

          <Link
            href="/finance/invest"
            className="bg-purple-700 hover:bg-purple-600 px-8 py-4 rounded-xl font-semibold shadow-lg text-center transition flex items-center justify-center gap-3"
          >
            <FaPiggyBank size={20} /> Invest
          </Link>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = context.req.headers.cookie;
    if (!cookies) throw new Error("No cookies found");

    const { token } = cookie.parse(cookies);
    if (!token) throw new Error("No token found");

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { coins: true },
    });

    if (!user) throw new Error("User not found");

    return {
      props: {
        coins: user.coins ?? 0,
      },
    };
  } catch (error) {
    console.error("Finance page access error:", error);
    return { redirect: { destination: "/login", permanent: false } };
  }
};
