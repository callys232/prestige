import { NextRequest } from "next/server";
import { Product } from "../../../../lib/models/Product";
import connectDB from "../../../../lib/db";
import { ok, badRequest, notFound } from "../../../../lib/response";
// import { requireAuth } from "../../../../../lib/middleware/requireAuth";
// File: app/api/product/[id]/route.ts

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//     await connectDB();

//     let userId: string | null = null;
//     // let wishlistProductIds: string[] = [];

//     try {
//         const decoded = requireAuth(request);
//         // userId = decoded.sub;

//         // const wishlist = await Wishlist.findOne({ user: userId });
//         // if (wishlist) {
//         //     wishlistProductIds = wishlist.products.map((id: string) => id.toString());
//         // }


//         const product = await Product.findById(params.id).lean();
//         if (!product) {
//             return notFound("Product not found");
//         }

//         const enriched = {
//             ...product,
//         };

//         return ok(enriched);
//     } catch (err) {
//         // User not authenticated — skip wishlist logic
//         console.warn("User not authenticated, skipping wishlist logic", err);
//     }
// }

// PUT /api/product/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    const body = await request.json();
    try {
        const updated = await Product.findByIdAndUpdate(params.id, body, { new: true }).lean();
        if (!updated) {
            return notFound("Product not found");
        }
        return ok(updated);
    } catch (error) {
        return badRequest("Invalid product data: " + error);
    }
}

// DELETE /api/product/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await connectDB();
    try {
        const deleted = await Product.findByIdAndDelete(params.id).lean();
        if (!deleted) {
            return notFound("Product not found");
        }
        return ok(deleted);
    } catch {
        return notFound("Product not found");
    }
}
