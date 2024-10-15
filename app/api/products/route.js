import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const productsQuery = collection(db, "products");
    const snapshot = await getDocs(productsQuery);

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      products,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
