import fs from 'fs';
import archiver from 'archiver';

export function zipFiles(outputZipPath, files) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve(outputZipPath));
        archive.on('error', reject);

        archive.pipe(output);

        files.forEach((file) => {
            archive.file(file, { name: file.split('/').pop() });
        });

        archive.finalize();
    });
}
