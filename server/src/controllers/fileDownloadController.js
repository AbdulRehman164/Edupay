import fs from 'fs';

async function fileDownloadController(req, res) {
    const { id } = req.params;
    const filePath = `generated/${id}`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${id}`);
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.sendStatus(404));
    stream.pipe(res);
}

export default fileDownloadController;
