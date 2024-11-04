class HashConverter(object):
    """
    Used in urls.py as hash pattern
    """

    regex = "[0-9a-zA-Z_-]+"

    def to_python(self, value):
        return str(value)

    def to_url(self, value):
        return str(value)
