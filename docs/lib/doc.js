import fs from "fs";
import matter from "gray-matter";
import path from "path";

const pathToDocs = path.join(process.cwd(), "docs");

export function getDocuments() {
    const filenames = fs.readdirSync(pathToDocs);

    const allDocuments = filenames
        .map((filename) => {
            const fullPath = path.join(pathToDocs, filename);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                // Skip directories
                return null;
            }

            const id = filename.replace(".md", "");
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const matterResult = matter(fileContents);

            return {
                id,
                ...matterResult.data,
            };
        })
        .filter((doc) => doc !== null); // Remove any null entries (directories)

    return allDocuments.sort((a, b) => {
        if (a.order < b.order) {
            return -1;
        }
        if (a.order > b.order) {
            return 1;
        } else {
            return 0;
        }
    });
}
