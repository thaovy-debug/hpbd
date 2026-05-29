const canvas = document.getElementById('heartCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let CANVAS_WIDTH = window.innerWidth;
    let CANVAS_HEIGHT = window.innerHeight;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    let CANVAS_CENTER_X = CANVAS_WIDTH / 2;
    let CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;
    const IMAGE_ENLARGE = 11;
    const HEART_COLOR = "#f76070";

    function heart_function(t, shrink_ratio = IMAGE_ENLARGE) {
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        x *= shrink_ratio;
        y *= shrink_ratio;
        x += CANVAS_CENTER_X;
        y += CANVAS_CENTER_Y;
        return [Math.trunc(x), Math.trunc(y)];
    }

    function scatter_inside(x, y, beta = 0.15) {
        let ratio_x = -beta * Math.log(Math.random());
        let ratio_y = -beta * Math.log(Math.random());
        let dx = ratio_x * (x - CANVAS_CENTER_X);
        let dy = ratio_y * (y - CANVAS_CENTER_Y);
        return [x - dx, y - dy];
    }

    function shrink(x, y, ratio) {
        let force = -1 / Math.pow(Math.pow(x - CANVAS_CENTER_X, 2) + Math.pow(y - CANVAS_CENTER_Y, 2), 0.6);
        let dx = ratio * force * (x - CANVAS_CENTER_X);
        let dy = ratio * force * (y - CANVAS_CENTER_Y);
        return [x - dx, y - dy];
    }

    function curve(p) {
        return 2 * (2 * Math.sin(4 * p)) / (2 * Math.PI);
    }

    class Heart {
        constructor(generate_frame = 20) {
            this._points = new Set();
            this._edge_diffusion_points = new Set();
            this._center_diffusion_points = new Set();
            this.all_points = {};
            this.generate_frame = generate_frame;
            this.build(2000);
            for (let frame = 0; frame < generate_frame; frame++) {
                this.calc(frame);
            }
        }

        build(number) {
            for (let i = 0; i < number; i++) {
                let t = Math.random() * 2 * Math.PI;
                let [x, y] = heart_function(t);
                this._points.add(`${x},${y}`);
            }

            let _pointsArray = Array.from(this._points).map(p => p.split(',').map(Number));
            for (let [x, y] of _pointsArray) {
                for (let i = 0; i < 3; i++) {
                    let [nx, ny] = scatter_inside(x, y, 0.05);
                    this._edge_diffusion_points.add(`${nx},${ny}`);
                }
            }

            for (let i = 0; i < 4000; i++) {
                let [x, y] = _pointsArray[Math.floor(Math.random() * _pointsArray.length)];
                let [nx, ny] = scatter_inside(x, y, 0.17);
                this._center_diffusion_points.add(`${nx},${ny}`);
            }
        }

        calc_position(x, y, ratio) {
            let force = 1 / Math.pow((Math.pow(x - CANVAS_CENTER_X, 2) + Math.pow(y - CANVAS_CENTER_Y, 2)), 0.520);
            let dx = ratio * force * (x - CANVAS_CENTER_X) + Math.floor(Math.random() * 3) - 1;
            let dy = ratio * force * (y - CANVAS_CENTER_Y) + Math.floor(Math.random() * 3) - 1;
            return [x - dx, y - dy];
        }

        calc(generate_frame) {
            let ratio = 10 * curve(generate_frame / 10 * Math.PI);
            let halo_radius = Math.trunc(4 + 6 * (1 + curve(generate_frame / 10 * Math.PI)));
            let halo_number = Math.trunc(3000 + 4000 * Math.abs(Math.pow(curve(generate_frame / 10 * Math.PI), 2)));

            let all_points = [];
            let heart_halo_point = new Set();
            for (let i = 0; i < halo_number; i++) {
                let t = Math.random() * 2 * Math.PI;
                let [x, y] = heart_function(t, 11.6);
                [x, y] = shrink(x, y, halo_radius);
                if (!heart_halo_point.has(`${Math.trunc(x)},${Math.trunc(y)}`)) {
                    heart_halo_point.add(`${Math.trunc(x)},${Math.trunc(y)}`);
                    x += Math.floor(Math.random() * 29) - 14;
                    y += Math.floor(Math.random() * 29) - 14;
                    let size = [1, 2, 2][Math.floor(Math.random() * 3)];
                    all_points.push([x, y, size]);
                }
            }

            let _pointsArray = Array.from(this._points).map(p => p.split(',').map(Number));
            for (let [x, y] of _pointsArray) {
                let [nx, ny] = this.calc_position(x, y, ratio);
                let size = Math.floor(Math.random() * 3) + 1;
                all_points.push([nx, ny, size]);
            }

            let _edge_diffusion_pointsArray = Array.from(this._edge_diffusion_points).map(p => p.split(',').map(Number));
            for (let [x, y] of _edge_diffusion_pointsArray) {
                let [nx, ny] = this.calc_position(x, y, ratio);
                let size = Math.floor(Math.random() * 2) + 1;
                all_points.push([nx, ny, size]);
            }

            let _center_diffusion_pointsArray = Array.from(this._center_diffusion_points).map(p => p.split(',').map(Number));
            for (let [x, y] of _center_diffusion_pointsArray) {
                let [nx, ny] = this.calc_position(x, y, ratio);
                let size = Math.floor(Math.random() * 2) + 1;
                all_points.push([nx, ny, size]);
            }

            this.all_points[generate_frame] = all_points;
        }

        render(ctx, render_frame) {
            let points = this.all_points[render_frame % this.generate_frame];
            ctx.fillStyle = HEART_COLOR;
            for (let [x, y, size] of points) {
                ctx.fillRect(x, y, size, size);
            }
        }
    }

    let heart = new Heart();
    let render_frame = 0;

    function draw() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        heart.render(ctx, render_frame);
        render_frame++;
        setTimeout(draw, 160);
    }

    draw();

    window.addEventListener('resize', () => {
        CANVAS_WIDTH = window.innerWidth;
        CANVAS_HEIGHT = window.innerHeight;
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        CANVAS_CENTER_X = CANVAS_WIDTH / 2;
        CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;
        heart = new Heart(); // Rebuild for new center
    });
}
