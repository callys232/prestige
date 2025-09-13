import { NextRequest, } from "next/server";
import { Product } from "../../../lib/models/Product";
import { ProductCategory } from "../../../lib/models/ProductCategory";
import connectDB from "../../../lib/db";
import { ok, created, } from "../../../lib/response";
// import { requireAuth } from "../../../lib/middleware/requireAuth";


// Create product
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const product = new Product(body);
        await Product.create(product);
        return created(product);
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function GET() {
    await connectDB();
    try {

        const products = await Product.find()
            .populate({
                path: "category",
                model: ProductCategory,
                select: ["name", "description", "id"],
            }).lean();

        // Add "favourite" field to each product if user is authenticated
        const enriched = products.map((product) => ({
            ...product,
        }));

        return ok(enriched);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        // User not authenticated — that's fine, we just skip wishlist logic
    }
}
