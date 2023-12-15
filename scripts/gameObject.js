class GameObject
{
    constructor(x, y, width, height, name="gameObject")
    {
        this.destroyed = false;
        this.position = {x:x, y:y};
        this.size = {x:width, y:height};
        this.name = name;
    }
}

class Vector2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    add(b)
    {
        return new Vector2(this.x + b.x, this.y + b.y);
    }

    rest(b)
    {
        return new Vector2(this.x - b.x, this.y - b.y);
    }

    divide(factor)
    {
        return new Vector2(this.x / factor, this.y / factor);
    }

    multiply(factor)
    {
        return new Vector2(this.x * factor, this.y * factor);
    }
}

class Logo extends GameObject
{
    constructor(x, y, width, height, name="gameObject", spr, sound)
    {
        super(x, y, width, height, name="gameObject");
        this.snd = sound;
        this.sprite = spr;
        this.position = new Vector2(x, y);
        this.size = new Vector2(width, height);
        this.position.x = (Math.random() * 506) + 3;
        this.position.y = -64;
        this.direction = new Vector2(0, 1);
        this.randomize();

        this.notes = [
            0.25,
            0.5,
            0.75,
            1,
            0.15,
            0.4,
            0.65,
            0.9
        ]

        this.noteId = 0;
    }

    update()
    {
        this.position.x += this.direction.x;
        this.position.y += this.direction.y;

        var bounced = false;

        if (this.position.x < 0)
        {
            this.position.x = 0;
            this.direction.x *= -1;
            bounced = true;
        }

        if (this.position.x > (512 - this.size.x))
        {
            this.position.x = (512 - this.size.x);
            this.direction.x *= -1;
            bounced = true;
        }

        if (this.position.y < 0)
        {
            this.position.y = 0;
            this.direction.y *= -1;
            bounced = true;
        }

        if (this.position.y > (512 - this.size.y))
        {
            this.position.y = (512 - this.size.y);
            this.direction.y *= -1;
            bounced = true;
        }

        if (bounced)
        {
            this.snd.currentTime = 0;
            this.snd.preservesPitch = false;
            this.snd.playbackRate = this.notes[this.noteId];
            this.snd.play();

            this.noteId++;

            if (this.noteId >= this.notes.length) { this.noteId = 0; }
        }
    }

    randomize()
    {
        var options = [
            new Vector2(-1, 1),
            new Vector2(-1, -1),
            new Vector2(1, -1),
            new Vector2(1, 1)
        ]

        var ind = Math.floor(Math.random() * 4);
        var selected = options[ind];

        this.direction.x = selected.x;
        this.direction.y = selected.y;

        this.position.x = Math.floor(Math.random() * (512 - this.size.x));
        this.position.y = Math.floor(Math.random() * (512 - this.size.y));
    }

    draw(ctx)
    {
        ctx.drawImage(this.sprite, this.position.x, this.position.y);
    }
}