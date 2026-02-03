import fs from 'fs';
import archiver from 'archiver';

export function zipFiles(outputZipPath, files, signal) {
    return new Promise((resolve, reject) => {
        signal?.throwIfAborted();

        const output = fs.createWriteStream(outputZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        const abortHandler = () => {
            try {
                archive.abort();
                output.destroy();
            } catch {}
            reject(signal.reason || new Error('ZIP creation cancelled'));
        };

        signal?.addEventListener('abort', abortHandler);

        output.on('close', () => {
            signal?.removeEventListener('abort', abortHandler);
            resolve(outputZipPath);
        });

        output.on('error', (err) => {
            signal?.removeEventListener('abort', abortHandler);
            reject(err);
        });

        archive.on('error', (err) => {
            signal?.removeEventListener('abort', abortHandler);
            reject(err);
        });

        archive.pipe(output);

        for (const file of files) {
            signal?.throwIfAborted();
            archive.file(file, { name: file.split('/').pop() });
        }

        archive.finalize();
    });
}
