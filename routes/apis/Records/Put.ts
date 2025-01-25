import { Database } from "bun:sqlite";

export default async (c: any, db: Database) => {
    const id = c.req.param("id"); // Get the record ID from the route parameter

    // Extract URL query parameters for updates
    const queryParams = c.req.query();
    const allowedFields = [
        "parent_name",
        "parent_email",
        "parent_phone_number",
        "parent_pickup_code",
        "child_name",
        "parent_img_url",
        "child_img_url",
        "status"
    ];

    // Filter valid fields to update
    const fieldsToUpdate = Object.keys(queryParams).filter((key) =>
        allowedFields.includes(key)
    );

    if (!fieldsToUpdate.length) {
        return c.json({ error: "No valid fields provided for update." }, 400);
    }

    try {
        // Build the dynamic SQL query
        const setClause = fieldsToUpdate
            .map((field) => `${field} = ?`)
            .join(", ");
        const values = fieldsToUpdate.map((field) => queryParams[field]);

        // Add the record ID to the values array
        values.push(id);

        // Prepare and execute the SQL query
        const stmt = db.query(`
            UPDATE records 
            SET ${setClause} 
            WHERE id = ?
        `);

        const result = stmt.run(...values);

        // Check if any rows were updated
        if (result.changes === 0) {
            return c.json({ error: "Record not found or no changes made." }, 404);
        }

        return c.json({ message: "Record updated successfully." });
    } catch (error: any) {
        // Handle unique constraint violations and other errors
        if (error.message.includes("UNIQUE constraint failed")) {
            return c.json(
                { error: "One or more unique fields already exist." },
                409
            );
        }
        return c.json({ error: "Failed to update record.", details: error.message }, 500);
    }
};
